function getUserProfile(userDetails = {}) {
  const profile = {
    Identity: userDetails.proID,
    Email: userDetails.email,
    Name: userDetails.displayName,
    first_name: userDetails.firstName,
    last_name: userDetails.lastName,
    business_name: userDetails.businessName,
    cert: userDetails.certificationBody,
    cert_num: userDetails.certificationNum,
    plan_id: userDetails.planIds,
    email_opted_in: userDetails.emailOptIn,
    userId: userDetails.proID,
    end_onboard_date: userDetails.museConnecterSince
  }
  return {
    Site: profile
  }
}
// creates a new user session with pushed user profile details
export function cleverTapLoginProfile(userDetails = {}) {
  const userProfile = getUserProfile(userDetails)
  clevertap.onUserLogin.push(userProfile);
}

// updates the pushed user profile
export function cleverTapPushProfile(userDetails = {}) {
  const userProfile = getUserProfile(userDetails)
  clevertap.profile.push(userProfile);
}
// updated user profile into clever tap and push 'login' event
export function cleverTapLogin(profile) {
  cleverTapPushProfile(profile)
  clevertap.event.push('login'); // as user enters into main app
}

export function cleverTapSignupStart() {
  clevertap.event.push('signup_start');
}

export function cleverTapSignupSuccess() {
  clevertap.event.push('signup_success');
}

export function cleverTapBasicInfoCompleted() {
  clevertap.event.push('basic_info_completed')
}

export function cleverTapBusinessAndProfessionCompleted() {
  clevertap.event.push('bus_prof_completed')
}

export function cleverTapSendInvite() {
  clevertap.event.push('send_invite')
}

export function cleverTapResendInvite() {
  clevertap.event.push('resend_invite')
}

export function cleverTapCancelInvite() {
  clevertap.event.push('cancel_invite')
}
export function cleverTapArchiveClient() {
  clevertap.event.push('archive_client')
}

export function cleverTapChangePlan() {
  clevertap.event.push('change_plan')
}

export function cleverTapViewClient() {
  clevertap.event.push('view_client')
}

export function cleverTapAddToCart() {
  clevertap.event.push('add_to_cart')
}

export function cleverTapCheckout() {
  clevertap.event.push('checkout')
}

export function cleverTapViewNote() {
  clevertap.event.push('view_note')
}

export function cleverTapAddNote() {
  clevertap.event.push('add_note')
}

export function cleverTapEditNote() {
  clevertap.event.push('edit_note')
}

export function cleverTapDeleteNote() {
  clevertap.event.push('delete_note')
}

export function cleverTapSaveNote() {
  clevertap.event.push('save_note')
}
// log the event when user clicks on Logout at Popover in Header of Professional layout
export function cleverTapSignoutClick() {
  clevertap.event.push('sign_out')
}

// logs out the user from clevertap as logout event dispatch in system.
export function cleverTapLogout() {
  if (clevertap.logout) {
    clevertap.logout()
  }
}

export default {
  cleverTapLogin,
  cleverTapSignupStart,
  cleverTapSignupSuccess,
  cleverTapSendInvite,
  cleverTapResendInvite,
  cleverTapCancelInvite,
  cleverTapArchiveClient,
  cleverTapChangePlan,
  cleverTapViewClient,
  cleverTapLogout
}
