import { Routes } from '@angular/router';
import { AboutComponent } from './pages/components/about/about.component';
import { HomeComponent } from './pages/components/home/home.component';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () =>
            import('./pages/components/home/home.component')
            .then(m => m.HomeComponent)
    },
    
    {
        path: 'about',
        component: AboutComponent
    },

    // Rota Padrão
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },

    // 404
    {
        path: '**',
        component: HomeComponent
    }

];
