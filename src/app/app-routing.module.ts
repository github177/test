import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'news',
        loadChildren: './news/news.module#NewsModule'
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'news'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
