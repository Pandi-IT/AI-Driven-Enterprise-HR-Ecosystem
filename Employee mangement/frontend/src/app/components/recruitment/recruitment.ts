import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const marked: any;

@Component({
  selector: 'app-recruitment',
  imports: [CommonModule, FormsModule],
  templateUrl: './recruitment.html',
  styleUrls: ['./recruitment.css'],
  standalone: true
})
export class RecruitmentComponent implements OnInit {
  jobs: any[] = [];
  selectedJob: any = null;
  candidates: any[] = [];
  isJobsLoading = true;
  isCandidatesLoading = false;

  // New Job Modal state
  showJobModal = false;
  jobTitle = '';
  jobDept = 'Engineering';
  jobDescription = '';
  isJdGenerating = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.fetchJobs();
  }

  fetchJobs() {
    this.isJobsLoading = true;
    this.api.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.isJobsLoading = false;
        if (data.length > 0 && !this.selectedJob) {
          this.selectJob(data[0]);
        }
      },
      error: () => (this.isJobsLoading = false)
    });
  }

  selectJob(job: any) {
    this.selectedJob = job;
    this.fetchJobCandidates(job.id);
  }

  fetchJobCandidates(jobId: number) {
    this.isCandidatesLoading = true;
    this.candidates = [];
    this.api.getJobCandidates(jobId).subscribe({
      next: (data) => {
        this.candidates = data.reverse();
        this.isCandidatesLoading = false;
      },
      error: () => (this.isCandidatesLoading = false)
    });
  }

  openJobModal() {
    this.jobTitle = '';
    this.jobDept = 'Engineering';
    this.jobDescription = '';
    this.showJobModal = true;
  }

  closeJobModal() {
    this.showJobModal = false;
  }

  generateAiJd() {
    if (!this.jobTitle || !this.jobDept) {
      alert('Please fill out the Job Title and Department fields first!');
      return;
    }
    this.isJdGenerating = true;
    this.jobDescription = 'Generating Description with Llama 3.3 Engine...';

    this.api.generateJD(this.jobTitle, this.jobDept).subscribe({
      next: (data) => {
        this.jobDescription = data.jd;
        this.isJdGenerating = false;
      },
      error: () => {
        this.jobDescription = 'Failed to generate Description.';
        this.isJdGenerating = false;
      }
    });
  }

  onSubmitJob() {
    const payload = {
      title: this.jobTitle,
      department: this.jobDept,
      description: this.jobDescription
    };

    this.api.createJob(payload).subscribe({
      next: (newJob) => {
        this.closeJobModal();
        this.fetchJobs();
        this.selectJob(newJob);
      },
      error: () => {
        alert('Creating job posting failed.');
      }
    });
  }

  getParsedText(text: string): string {
    try {
      return marked ? marked.parse(text) : text;
    } catch {
      return text;
    }
  }
}
