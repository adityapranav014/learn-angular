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


import { StudyNotesComponent } from '../components/study-notes/study-notes.component';
import { GlobalSearchComponent } from '../components/global-search/global-search.component';


export const routes: Routes = [
    // --- Core Routes ---
    {
        path: '',
        component: HomeComponent,
        title: 'Home | Angular Architecture',
        data: {
            description: 'Learn Angular Architecture, core concepts, directives, and hands-on logical scenarios for educational purposes.',
            keywords: 'Angular, Angular Architecture, Routing, Directives, Core Concepts'
        }
    },
    {
        path: 'one',
        component: TopicOneComponent,
        title: '*ngIf Directive and @if Decorator',
        data: {
            description: 'Learn and compare the legacy *ngIf directive with the modern @if control flow decorator in Angular.',
            keywords: 'Angular, ngIf, if decorator, control flow, conditional rendering'
        }
    },
    {
        path: 'two',
        component: TopicTwoComponent,
        title: '*ngFor Directive and @for Decorator',
        data: {
            description: 'Explore list rendering in Angular using *ngFor directive and the modern, high-performance @for block syntax.',
            keywords: 'Angular, ngFor, for decorator, list rendering, tracking'
        }
    },
    {
        path: 'three',
        component: TopicThreeComponent,
        title: '*ngClass Directive',
        data: {
            description: 'Master dynamic CSS class bindings in Angular using the *ngClass and *ngStyle directives.',
            keywords: 'Angular, ngClass, ngStyle, dynamic styling, CSS binding'
        }
    },
    {
        path: 'study-notes',
        component: StudyNotesComponent,
        title: 'Angular Study Notes',
        data: {
            description: 'In-depth Angular study notes, interview prep questions, and architectural design decisions.',
            keywords: 'Angular study notes, Angular interview prep, Angular architecture'
        }
    },
    {
        path: 'study-notes/:topicId',
        component: StudyNotesComponent,
        title: 'Angular Study Notes',
        data: {
            description: 'Specific topic study notes for Angular preparation, covering Reactivity, Components, Services, and Optimization.',
            keywords: 'Angular reactivity, Signals, RxJS, Dependency Injection, Defer blocks'
        }
    },
    {
        path: 'ai-search',
        component: GlobalSearchComponent,
        title: 'AI Study Search',
        data: {
            description: 'AI-powered Angular study notes search using Gemini. Get instant theory and runnable code examples for any topic.',
            keywords: 'Angular AI search, Gemini study notes, Angular learning'
        }
    },

    // --- Logical Scenarios: Commerce & Logistics ---
    {
        path: 'subscription',
        component: SubscriptionComponent,
        title: 'Subscriptions',
        data: {
            description: 'Interactive subscription package selection and billing model built with Angular.',
            keywords: 'Angular forms, subscription billing, interactive UI'
        }
    },
    {
        path: 'rail-transit',
        component: RailTransitComponent,
        title: 'Train Booking Form',
        data: {
            description: 'A comprehensive rail transit booking workflow demonstrating complex form validations and dynamic fields.',
            keywords: 'Angular reactive forms, form validation, train booking'
        }
    },
    {
        path: 'box-office',
        component: BoxOfficeComponent,
        title: 'Movie Ticket',
        data: {
            description: 'Dynamic seat booking and movie ticket checkout application built in Angular.',
            keywords: 'seat layout, ticket checkout, interactive booking'
        }
    },
    {
        path: 'zoom-car-rental',
        component: FleetComponent,
        title: 'Zoom Car Rental System',
        data: {
            description: 'Car rental fleet management and price calculation calculator built using Angular components.',
            keywords: 'car rental, fleet list, cost calculation'
        }
    },
    {
        path: 'hotel-order',
        component: HospitalityComponent,
        title: 'Hotel Order System',
        data: {
            description: 'A hospitality order system for placing and tracking room service and amenities requests.',
            keywords: 'hospitality app, hotel booking, order list'
        }
    },
    {
        path: 'grocery-cart',
        component: CartComponent,
        title: 'Grocery List Cart',
        data: {
            description: 'A stateful grocery shopping cart to add, remove, and update quantities of items dynamically.',
            keywords: 'shopping cart, state management, grocery list'
        }
    },
    {
        path: 'student-registration',
        component: EnrollmentComponent,
        title: 'Student Registration Form',
        data: {
            description: 'Standard student registration form showcasing validations and model bindings in Angular.',
            keywords: 'student enrollment, registration form, input validation'
        }
    },

    // --- Logical Scenarios: Architecture & State ---
    {
        path: 'calculator',
        component: ComputeComponent,
        title: 'Calculator',
        data: {
            description: 'A simple mathematical calculator built with Angular data binding and arithmetic operations.',
            keywords: 'Angular calculator, arithmetic operations, data binding'
        }
    },
    {
        path: 'todo-list',
        component: TasksComponent,
        title: 'To Do List App',
        data: {
            description: 'A task management application featuring CRUD operations and local storage persistence.',
            keywords: 'todo list, local storage, CRUD tasks'
        }
    },
    {
        path: 'kyc',
        component: KycComponent,
        title: 'KYC & Biometric Vault',
        data: {
            description: 'Security-focused KYC verification and biometric vault simulation using Angular forms.',
            keywords: 'KYC vault, identity verification, form flow'
        }
    },
    {
        path: 'tabs',
        component: TabsComponent,
        title: 'Dynamic Tab Selection',
        data: {
            description: 'Dynamic tabbed component switching pattern without standard routing.',
            keywords: 'tab navigation, dynamic components, angular tabs'
        }
    },
    {
        path: 'polymorphic',
        component: PolymorphicComponent,
        title: 'Polymorphic Interfaces',
        data: {
            description: 'Advanced design pattern demonstrating polymorphic components and dynamic interfaces in Angular.',
            keywords: 'polymorphism, dynamic components, design patterns'
        }
    },

    // --- Fallback Route ---
    {
        path: '**',
        redirectTo: ''
    }
];