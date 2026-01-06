<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DonorNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $recipientName;
    public $emailSubject;
    public $emailMessage;
    public $details;
    public $actionUrl;
    public $actionText;

    /**
     * Create a new message instance.
     */
    public function __construct($recipientName, $emailSubject, $emailMessage, $details = null, $actionUrl = null, $actionText = null)
    {
        $this->recipientName = $recipientName;
        $this->emailSubject = $emailSubject;
        $this->emailMessage = $emailMessage;
        $this->details = $details;
        $this->actionUrl = $actionUrl;
        $this->actionText = $actionText;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->emailSubject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.notification',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
