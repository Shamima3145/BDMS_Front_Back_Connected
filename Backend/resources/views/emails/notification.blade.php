<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blood Donation Management System</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: #942222;
            padding: 30px;
            text-align: center;
        }
        .email-header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
        }
        .email-body {
            padding: 30px;
            color: #333333;
            line-height: 1.6;
        }
        .email-body h2 {
            color: #942222;
            font-size: 22px;
            margin-bottom: 15px;
        }
        .email-body p {
            margin-bottom: 15px;
            font-size: 16px;
        }
        .info-box {
            background-color: #f9f9f9;
            border-left: 4px solid #942222;
            padding: 15px;
            margin: 20px 0;
        }
        .info-box strong {
            color: #942222;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #942222;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: bold;
        }
        .button:hover {
            background-color: #7a1b1b;
        }
        .email-footer {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #777777;
        }
        .divider {
            height: 1px;
            background-color: #e0e0e0;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>🩸 Blood Donation Management System</h1>
        </div>
        
        <div class="email-body">
            <h2>{{ $emailSubject ?? 'Notification' }}</h2>
            
            <p>Dear {{ $recipientName ?? 'User' }},</p>
            
            <p>{{ $emailMessage ?? 'This is a notification from Blood Donation Management System.' }}</p>
            
            @if(isset($details))
            <div class="info-box">
                @foreach($details as $key => $value)
                    <p><strong>{{ $key }}:</strong> {{ $value }}</p>
                @endforeach
            </div>
            @endif
            
            @if(isset($actionUrl) && isset($actionText))
            <div style="text-align: center;">
                <a href="{{ $actionUrl }}" class="button">{{ $actionText }}</a>
            </div>
            @endif
            
            <div class="divider"></div>
            
            <p>Thank you for being a part of our blood donation community. Your contribution saves lives!</p>
            
            <p>Best regards,<br><strong>Blood Donation Management System Team</strong></p>
        </div>
        
        <div class="email-footer">
            <p>&copy; {{ date('Y') }} Blood Donation Management System. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
