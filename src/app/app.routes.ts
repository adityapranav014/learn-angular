import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { TopicOneComponent } from '../components/topic-one/topic-one.component';
import { TopicTwoComponent } from '../components/topic-two/topic-two.component';
import { TopicThreeComponent } from '../components/topic-three/topic-three.component';

export const routes: Routes = [

    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'one',
        component: TopicOneComponent,
        title: '*ngIf Directive and @if Decorator',
    },
    {
        path: 'two',
        component: TopicTwoComponent,
        title: '*ngFor Directive and @for Decorator',
    },
    {
        path: 'three',
        component: TopicThreeComponent,
        title: '*ngClass Directive',
    }




    // A wildcard route to catch bad URLs and redirect home
    //   { path: '**', redirectTo: '' }


];
