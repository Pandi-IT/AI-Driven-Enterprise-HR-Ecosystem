import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

declare const marked: any;

@Component({
  selector: 'app-careers',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './careers.html',
  styleUrls: ['./careers.css'],
  standalone: true
})
export class CareersComponent implements OnInit {
  jobs: any[] = [];
  openJobs: any[] = [];
  isLoading = true;
  hasError = false;

  // Application Modal state
  selectedJob: any = null;
  candFirstName = '';
  candLastName = '';
  candEmail = '';
  candResume = '';
  isSubmitting = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.fetchJobs();
  }

  fetchJobs() {
    this.api.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.openJobs = data.filter((j) => j.status === 'Open');
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  openApplyModal(job: any) {
    this.selectedJob = job;
    this.candFirstName = '';
    this.candLastName = '';
    this.candEmail = '';
    this.candResume = '';
  }

  closeApplyModal() {
    this.selectedJob = null;
  }

  onSubmitApplication() {
    if (!this.selectedJob) return;
    this.isSubmitting = true;

    // First rank the candidate resume with AI suitability
    this.api.rankCandidate(this.selectedJob.description, this.candResume).subscribe({
      next: (aiData: any) => {
        const ranking = aiData.ranking;
        const scoreMatch = ranking.match(/(\d+)\/100/);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

        const candidate = {
          firstName: this.candFirstName,
          lastName: this.candLastName,
          email: this.candEmail,
          resumeText: this.candResume,
          score: score,
          aiFeedback: ranking,
          jobPosting: { id: this.selectedJob.id }
        };

        // Save application to backend
        this.api.applyJob(candidate).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.closeApplyModal();
            alert('Application submitted successfully! Our HR team will review it soon.');
          },
          error: () => {
            this.isSubmitting = false;
            alert('Saving application failed. Please try again.');
          }
        });
      },
      error: () => {
        this.isSubmitting = false;
        alert('AI suitability ranking failed. Please check your network and try again.');
      }
    });
  }

  getParsedDescription(desc: string): string {
    try {
      return marked ? marked.parse(desc) : desc;
    } catch {
      return desc;
    }
  }
}
