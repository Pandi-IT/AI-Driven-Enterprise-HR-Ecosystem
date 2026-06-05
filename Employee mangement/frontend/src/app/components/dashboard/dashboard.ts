import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const marked: any;

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true
})
export class DashboardComponent implements OnInit {
  // Mood / Pulse state
  moodEmoji = '😊';
  moodText = 'Steady Vibe';
  moodClass = 'text-white';
  showPulseModal = false;
  pulseRating = 5;
  pulseComment = '';

  // Chatbot state
  isChatbotOpen = false;
  chatInput = '';
  chatMessages: { text: string; isBot: boolean; isHtml?: boolean }[] = [
    { text: "Hello! I am your AI HR assistant. How can I help you manage NexaCorp today?", isBot: true }
  ];
  isChatLoading = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchMoodSummary();
  }

  fetchMoodSummary() {
    this.api.getMoodSummary().subscribe({
      next: (data) => {
        const text = data.summary.toLowerCase();
        if (text.includes('low') || text.includes('warning') || text.includes('unhappy')) {
          this.moodEmoji = '😟';
          this.moodText = 'Morale Alert';
          this.moodClass = 'text-warning-glow';
        } else if (text.includes('high') || text.includes('positive') || text.includes('great')) {
          this.moodEmoji = '🤩';
          this.moodText = 'Peak Morale';
          this.moodClass = 'text-success-glow';
        } else {
          this.moodEmoji = '😊';
          this.moodText = 'Steady Vibe';
          this.moodClass = 'text-white';
        }
      },
      error: () => {
        this.moodEmoji = '😊';
        this.moodText = 'Steady Vibe';
        this.moodClass = 'text-white';
      }
    });
  }

  openPulseModal() {
    this.showPulseModal = true;
    this.pulseRating = 5;
    this.pulseComment = '';
  }

  closePulseModal() {
    this.showPulseModal = false;
  }

  onSubmitPulse() {
    this.api.submitPulse(this.pulseRating, this.pulseComment).subscribe({
      next: () => {
        alert('Thank you for your feedback!');
        this.closePulseModal();
        this.fetchMoodSummary();
      },
      error: () => {
        alert('Submitting pulse survey failed.');
      }
    });
  }

  toggleChatbot() {
    this.isChatbotOpen = !this.isChatbotOpen;
  }

  sendChatMessage() {
    const msg = this.chatInput.trim();
    if (!msg) return;

    this.chatMessages.push({ text: msg, isBot: false });
    this.chatInput = '';
    this.isChatLoading = true;

    this.api.chat(msg).subscribe({
      next: (data) => {
        this.isChatLoading = false;
        let parsed = data.response;
        try {
          if (marked) {
            parsed = marked.parse(data.response);
          }
        } catch {}
        this.chatMessages.push({ text: parsed, isBot: true, isHtml: true });
      },
      error: () => {
        this.isChatLoading = false;
        this.chatMessages.push({ text: '⚠️ Connection failed. Could not reach AI HR assistant.', isBot: true });
      }
    });
  }

  logout() {
    sessionStorage.removeItem('hrLoggedIn');
    this.router.navigate(['/landing']);
  }
}
