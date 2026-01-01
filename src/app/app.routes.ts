import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { RecipeComponent } from './recipe/recipe';
import { SensorsComponent } from './sensors/sensors';
import { InventoryComponent } from './inventory/inventory';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'recipe', component: RecipeComponent },
    { path: 'inventory', component: InventoryComponent },
    { path: 'sensors', component: SensorsComponent },
];
