import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-section">
      <h2>Settings</h2>
      <p>Feature coming soon: Manage your preferences</p>
    </div>
  `,
  styles: [`
    .content-section {
      padding: 2rem;
    }
    h2 {
      margin-top: 0;
      color: #0f172a;
    }
    p {
      color: #64748b;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsContentComponent {}
