import { Routes } from '@angular/router';
import { AboutComponent } from './pages/components/about/about.component';
import { HomeComponent } from './pages/components/home/home.component';
import { Component } from '@angular/core';
import { FormsComponent } from './pages/components/forms/forms.component';

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

    {
        path: 'forms',
        component: FormsComponent
    },

    // O padrão é que a rota seja "/home", caso aconteça do usuário apagar o '/home' será redirecionado para a /home
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },

    // Essa rota vai direcionar para a página home em caso de erro 404
    {
        path: '**',
        component: HomeComponent
    },

];
