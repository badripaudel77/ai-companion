import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '../../store/auth.facade';

@Component({
  selector: 'app-workspace-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './workspace.page.html',
  styleUrl: './workspace.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspacePageComponent {
  private readonly authFacade = inject(AuthFacade);

  protected readonly user = this.authFacade.user;
  protected readonly logout = (): void => this.authFacade.logout();
}
