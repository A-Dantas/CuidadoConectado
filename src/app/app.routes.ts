import { Routes } from '@angular/router';
import { AboutComponent } from './pages/components/about/about.component';
import { HomeComponent } from './pages/components/home/home.component';
import { Component } from '@angular/core';
import { FormsComponent } from './pages/components/forms/forms.component';
import { LoginComponent } from './pages/components/login/login.component';
import { GestorComponent } from './pages/components/system/gestor/gestor.component';
import { CuidadorComponent } from './pages/components/system/cuidador/cuidador.component';
import { MedicoComponent } from './pages/components/system/medico/medico.component';
import { FamiliarComponent } from './pages/components/system/familiar/familiar.component';

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

    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: 'gestor',
        component: GestorComponent
    },

    {
        path: 'cuidador',
        component: CuidadorComponent
    },

    {
        path: 'medico' ,
        component: MedicoComponent
    },

    {
        path: 'familiar',
        component: FamiliarComponent
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
