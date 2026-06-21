import { Routes } from '@angular/router';

// Core Imports
import { HomeComponent } from '../components/home/home.component';
import { TopicOneComponent } from '../components/topic-one/topic-one.component';
import { TopicTwoComponent } from '../components/topic-two/topic-two.component';
import { TopicThreeComponent } from '../components/topic-three/topic-three.component';
import { SubscriptionComponent } from '../components/subscription/subscription.component';
import { RailTransitComponent } from '../components/rail-transit/rail-transit.component';
import { BoxOfficeComponent } from '../components/box-office/box-office.component';
import { FleetComponent } from '../components/fleet/fleet.component';
import { HospitalityComponent } from '../components/hospitality/hospitality.component';
import { CartComponent } from '../components/cart/cart.component';
import { EnrollmentComponent } from '../components/enrollment/enrollment.component';
import { ComputeComponent } from '../components/compute/compute.component';
import { TasksComponent } from '../components/tasks/tasks.component';
import { KycComponent } from '../components/kyc/kyc.component';
import { TabsComponent } from '../components/tabs/tabs.component';
import { PolymorphicComponent } from '../components/polymorphic/polymorphic.component';


export const routes: Routes = [
    // --- Core Routes ---
    {
        path: '',
        component: HomeComponent,
        title: 'Home | Angular Architecture',
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
    },

    // --- Logical Scenarios: Commerce & Logistics ---
    {
        path: 'subscription',
        component: SubscriptionComponent,
        title: 'Subscriptions',
    },
    {
        path: 'rail-transit',
        component: RailTransitComponent,
        title: 'Train Booking Form',
    },
    {
        path: 'box-office',
        component: BoxOfficeComponent,
        title: 'Movie Ticket',
    },
    {
        path: 'zoom-car-rental',
        component: FleetComponent,
        title: 'Zoom Car Rental System',
    },
    {
        path: 'hotel-order',
        component: HospitalityComponent,
        title: 'Hotel Order System',
    },
    {
        path: 'grocery-cart',
        component: CartComponent,
        title: 'Smart Grocery Cart',
    },
    {
        path: 'student-registration',
        component: EnrollmentComponent,
        title: 'Student Registration Form',
    },


    // --- Logical Scenarios: Architecture & State ---
    {
        path: 'calculator',
        component: ComputeComponent,
        title: 'Calculator',
    },
    {
        path: 'todo-list',
        component: TasksComponent,
        title: 'To Do List App',
    },
    {
        path: 'kyc',
        component: KycComponent,
        title: 'KYC',
    },
    {
        path: 'tabs',
        component: TabsComponent,
        title: 'Dynamic Tabs',
    },

    {
        path: 'polymorphic',
        component: PolymorphicComponent,
        title: 'Dynamic UI Selection',
    },

    // --- Fallback Route ---
    {
        path: '**',
        redirectTo: ''
    }
];