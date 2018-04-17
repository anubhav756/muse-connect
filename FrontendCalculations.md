## Components
* `GET /client_aggregates`
  * **DASHBOARD PAGE**
    1. *"Active clients"* overview card
    2. *"For all client activity"* all clients activity card
* `GET /clients`
  * **CLIENT PROFILE PAGE**
    1. *"Past 7 days"* in overview card
* `GET /clients/:id`
  * **CLIENT PROFILE PAGE**
    1. *"Past 30 days"* in overview card
    2. Calendar component
    3. Aggregate activity graph
* `GET /clients/:id/sessions`
  * **CLIENT PROFILE PAGE**
    1. Daily activity infinite list

## Calculations related API endpoints

* `GET /client_aggregates`
* `GET /clients`
* `GET /clients/:id`
* `GET /clients/:id/sessions`

## Data entry points
| Page | API endpoints | Redux store key(s) | Consumer components |
| ---- | ------------- | ------------ | ----- |
| Dashboard | `GET /client_aggregates` | `allClients` | Overview card, Aggregate activity chart |
|| `GET /client` | `clientList` | Client List sidebar, "Recent Activity" card, "Pending clients" card, Big shift graph, "Recently accepted" card |
|| `GET /me` | `user` | Current user (access control) |
| Client Profile | `GET /clients` | `allClients`, `client.client` | "Past 7 Days" card, Sidebar |
|| `GET /clients/:id` | `client.aggregateSessions` | "Past 30 days" card, Calendar, Aggregate activity graph |
|| `GET /me` | `user` | Current user (access control) |
|| `GET /clients/:id/sessions` | `client.dailySessions` | Daily activity card list |
| All Clients | `GET /clients` | `allClients` | Client list |
|| `GET /me` | `user` | Current user (access control) |
| Account | `GET /me` | `user` | Sidebar, "Account" tab sections, "Billing" tab => "Billing information" section, "Plans" tab (to identify current/next plans) |
|| `GET /plans` | `subscription` | "Plans" tab plan cards |
|| `GET /transactions` | `account` | "Billing" tab "Invoices" section |

## Data Usage and Manipulations

### DASHBOARD PAGE
#### `GET /client_aggregates`
```
{
  aggregate_data: { ... },
  client_activity: [{
    date: 2017-08-31,
    ...

  }, {
    ...

  }]
}
```
* `aggregate_data`
  * **Usage**
    * Provides various pre-calculated values by the server, that are populated *as-is* in the Dashboard's overview card
    * The backend uses UTC (GMT+00:00) formatted dates to calculate these values
  * **Manipulations:**
    1. *None*
      > **Reason:** The server cannot calculate values in the client's local format.
* `client_activity`
  * **Usage**
    * Provides *day-wise* session lengths, of all the sessions by all the clients for a particular day
    * This date-stamp is provided in the UTC format
    * These values are used to populate data in the *"For all client activity"* graph, in the Dashboard page
    * The graph displays the dates as-is, and plots the date stamps in UTC format
  * **Manipulations:**
    1. These date-stamps are first converted into a default time-stamps (ie. the first instance for that date), and then the client's timezone's offset is added to it. In this way, when the aggregate chart tries to convert it back to local format (by subtracting the same offset), it's effect is nullified
      > **Reason:** To preserve the UTC date value, and avoid conflicts with the values displayed in *"Active clients"* overview card above it.

### CLIENT PROFILE PAGE
#### `GET /clients`
```
{
  active_clients: [{
    sessions_last_week: [{
      date: 2017-08-31T23:59:59+00:00,
      ...

    }, {
      ...

    }]
  }, {
    ...

  }],
  archived_clients: [ ... ],
  other_clients: [ ... ],
  ...

}
```
* `sessions_last_week`
  * **Usage**
    * Provides sessions lengths for past 7 days of the given client, in the UTC format
  * **Manipulations**
    1. The *session-wise* data (which is currently in UTC format) is first converted to local format dates
      > **Reason:** The final calculated values of the overview card must be consistent with the values displayed by other components of the same page.

    2. Then these *session-wise* local dates are aggregated into *day-wise* data, by adding up the session lengths of all the sessions within the same date
      > **Reason:** It makes it easier to calculate the various values, that are to be displayed in the *"Past 7 days"*, in overview card.

#### `GET /clients/:id`
```
{
  aggregate_sessions: [{
    datetime: 2017-08-31T23:59:59+00:00,
    ...

  }, {
    ...

  }]
}
```
* `aggregate_sessions`
  * **Usage**
    * Provides the *session-wise* data for each session taken by the given client in the UTC format
  * **Manipulations:**
    1. The *session-wise* data (which is currently in UTC format) is first converted to local format dates
      > **Reason:** This data is to be consumed by the calendar and the aggregate activity chart compononents too in the same page, ie. the client profile page, which require date-stamps in local formats only.

    2. Then these *session-wise* local dates are aggregated into *day-wise* data, by adding up the session lengths of all the sessions within the same date, and are stored against their respective date-stamps in the redux store
      > **Reason:** It is easier for the components, which are consuming this data, to process data in this format.

#### `GET /clients/:id/sessions`
```
{
  nextURL: ...,
  sessions: [{
    datetime: 2017-08-31T23:59:59+00:00,
    ...

  }, {
    ...

  }]
}
```
* `sessions`
  * **Usage**
    * Provides a detailed information about each single session taken by the given client
    * The time-stamps are provided in UTC format
  * **Manipulations**
    1. These time-stamps are converted to local formats before being plotted in the daily client activity (infinite scrollable) list
      > **Reason:** The line graph requires time-stamps in local format only.