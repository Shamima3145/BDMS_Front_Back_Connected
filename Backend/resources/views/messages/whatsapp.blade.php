🩸 *Blood Donation Management System*
━━━━━━━━━━━━━━━━━━━━━━━

*{{ $subject ?? 'Notification' }}*

Dear *{{ $recipientName ?? 'User' }}*,

{{ $message ?? 'This is a notification from Blood Donation Management System.' }}

@if(isset($details))
━━━━━━━━━━━━━━━━━━━━━━━
📋 *Details:*
@foreach($details as $key => $value)
▪️ *{{ $key }}:* {{ $value }}
@endforeach
━━━━━━━━━━━━━━━━━━━━━━━
@endif

@if(isset($actionUrl))
🔗 {{ $actionUrl }}
@endif

Thank you for being a part of our blood donation community. Your contribution saves lives! 💪❤️

_Blood Donation Management System Team_
━━━━━━━━━━━━━━━━━━━━━━━
📞 For support, contact us
🌐 Blood Donation Management System
