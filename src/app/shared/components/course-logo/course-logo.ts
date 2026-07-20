import { Component, Input } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';

@Component({
  selector: 'app-course-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="course-logo-badge" [ngStyle]="{ 'background-color': bgColor }">
      <span class="emoji" *ngIf="emoji">{{ emoji }}</span>
      <span class="initials">{{ initials }}</span>
    </div>
  `,
  styles: [
    `:host { display: block; width: 100%; height: 100%; }`,
    `.course-logo-badge { width:100%; height:100%; border-radius:inherit; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; box-sizing:border-box; padding: 0 12px; background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); border-radius: 12px; box-shadow: 0 8px 24px rgba(2,6,23,0.12); }`,
    `.emoji { font-size:30px; margin-right:8px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.12)); }`,
    `.initials { font-size:18px; text-shadow: 0 1px 0 rgba(0,0,0,0.12) }`
  ]
})
export class CourseLogo {
  @Input() title = '';
  @Input() emoji = '';

  get initials(): string {
    if (!this.title) return '';
    const parts = this.title.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }

  get bgColor(): string {
    // deterministic color from title hash
    let h = 0;
    for (let i = 0; i < this.title.length; i++) h = (h << 5) - h + this.title.charCodeAt(i);
    const colors = ['#4F46E5', '#059669', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
    const idx = Math.abs(h) % colors.length;
    return colors[idx];
  }
}
