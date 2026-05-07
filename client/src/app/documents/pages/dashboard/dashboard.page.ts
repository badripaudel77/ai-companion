import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthFacade } from '../../../auth/store/auth.facade';
import { DocumentsFacade } from '../../store/documents.facade';
import { Document } from '../../models/document.models';
import { CategoryGroupComponent } from '../../components/category-group/category-group.component';
import { DocumentListComponent } from '../../components/document-list/document-list.component';
import { DocumentUploadComponent } from '../../components/document-upload';
import { DocumentViewerComponent } from '../../components/document-viewer/document-viewer.component';
import { SidebarComponent, MenuItemId } from '../../components/sidebar/sidebar.component';
import { CreateContentComponent } from '../create/create.component';
import { SharedContentComponent } from '../shared/shared.component';
import { SettingsContentComponent } from '../settings/settings.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    CategoryGroupComponent,
    DocumentListComponent,
    DocumentUploadComponent,
    DocumentViewerComponent,
    SidebarComponent,
    CreateContentComponent,
    SharedContentComponent,
    SettingsContentComponent
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  private readonly documentsFacade = inject(DocumentsFacade);
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  protected readonly categories = this.documentsFacade.categories;
  protected readonly categoriesLoading = this.documentsFacade.categoriesLoading;
  protected readonly documentsByCategory = this.documentsFacade.documentsByCategory;
  protected readonly uploadingCategoryIds = this.documentsFacade.uploadingCategoryIds;
  protected readonly uploadErrors = this.documentsFacade.uploadErrors;
  protected readonly user = this.authFacade.user;

  protected readonly expandedCategoryIds = signal<Set<number>>(new Set());
  protected readonly activeMenu = signal<MenuItemId>('documents');
  protected readonly viewedDocument = signal<Document | null>(null);

  constructor() {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.documentsFacade.loadCategories({ pageNumber: 0, pageSize: 100 });
  }

  protected readonly toggleCategoryExpand = (categoryId: number): void => {
    const expanded = this.expandedCategoryIds();
    if (expanded.has(categoryId)) {
        expanded.delete(categoryId);
    } 
    else {
        expanded.add(categoryId);
        this.loadDocumentsForCategory(categoryId);
    }
    this.expandedCategoryIds.set(new Set(expanded));
  };

  private loadDocumentsForCategory(categoryId: number): void {
    this.documentsFacade.loadDocumentsByCategory(categoryId, {
      pageNumber: 0,
      pageSize: 50
    });
  }

  protected readonly onDownloadDocument = (event: { id: number; filename: string }): void => {
      this.documentsFacade.downloadDocument(event.id, event.filename);
  };

  protected readonly onViewDocument = (document: Document): void => {
      this.viewedDocument.set(document);
  };

  protected readonly onUploadDocument = (categoryId: number, file: File): void => {
      this.documentsFacade.uploadDocument(categoryId, file);
  };

  protected readonly onMenuChange = (menuId: MenuItemId): void => {
      this.activeMenu.set(menuId);
  };

  protected readonly logout = (): void => {
      this.authFacade.logout();
  };

  protected readonly navigateToWorkspace = (): void => {
      this.router.navigate(['/workspace']);
  };
}
