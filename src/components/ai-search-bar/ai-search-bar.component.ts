import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
    selector: 'app-ai-search-bar',
    templateUrl: './ai-search-bar.component.html',
    styleUrls: ['./ai-search-bar.component.scss'],
    host: {
        '[class.ai-search-host--expand]': 'expandOnHover()'
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiSearchBarComponent {
    readonly query = input('');
    readonly placeholder = input('Search with AI');
    readonly inputId = input<string | null>(null);
    readonly ariaLabel = input('Search with AI');
    readonly loading = input(false);
    readonly showClear = input(false);
    readonly disabled = input(false);
    readonly expandOnHover = input(true);

    readonly queryChange = output<string>();
    readonly submitClicked = output<void>();
    readonly clearClicked = output<void>();
    readonly shellClicked = output<void>();
    readonly shellMouseEnter = output<void>();
    readonly shellMouseLeave = output<void>();
    readonly shellTransitionEnd = output<TransitionEvent>();
    readonly inputFocused = output<void>();
    readonly inputKeydown = output<KeyboardEvent>();

    onInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.queryChange.emit(target.value);
    }

    onShellTransitionEnd(event: TransitionEvent): void {
        this.shellTransitionEnd.emit(event);
    }
}
