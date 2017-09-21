
import { 
    forwardRef,AfterViewInit,OnDestroy,Input,Output,
    EventEmitter,Renderer,ContentChild,Component,TemplateRef,ViewContainerRef,
    AfterViewChecked,Inject,ViewChild,ElementRef,
    ChangeDetectorRef,IterableDiffers
} from '@angular/core';

import { Column,Header,Footer,HeaderColumnGroup,FooterColumnGroup,PrimeTemplate } from 'primeng/components/common/shared';
import { ExtendComponent } from "core/metadata/extend-component.metadata"
import { DomHandler } from 'primeng/components/dom/domhandler';
import { ObjectUtils } from 'primeng/components/utils/ObjectUtils';
import { DataTable as PDataTable, ScrollableView as PScrollableView } from 'primeng/components/datatable/datatable';

import {
    RowExpansionLoader as PRowExpansionLoader,
    ColumnHeaders as PColumnHeaders,
    ColumnFooters as PColumnFooters,
    TableBody as PTableBody,
} from 'primeng/components/datatable/datatable';


export class ColumnHeaders extends PColumnHeaders {
    constructor(@Inject(forwardRef(() => DataTable)) public dt:DataTable) {
        super(dt);
    }
}

export class ColumnFooters extends PColumnFooters {
    constructor(@Inject(forwardRef(() => DataTable)) public dt:DataTable) {
        super(dt);
    }
}

export class TableBody extends PTableBody {
    constructor(@Inject(forwardRef(() => DataTable)) public dt:DataTable) {
        super(dt);
    }
}

export class ScrollableView extends PScrollableView{
    constructor(@Inject(forwardRef(() => DataTable)) public dt:DataTable, public domHandler:DomHandler, public el:ElementRef, public renderer:Renderer) {
        super(dt, domHandler, el, renderer);
    }

    initScrolling() {
        super.initScrolling();
        if(!this.frozen) {
            this.scrollBody.style.overflowY = 'scroll';
        }
    }

    private shouldShowRightMargin():boolean {
        let borderWidth = parseInt(this.scrollBody.style.borderWidth);
        if(borderWidth !== borderWidth){
            borderWidth = 0;
        }

        return (this.scrollBody.clientWidth < (this.scrollBody.offsetWidth - borderWidth*2));
    }

    private adjustScrollMesc() {
    }
}

@ExtendComponent({
    providers: [DomHandler, ObjectUtils]
})
export class DataTable extends PDataTable {
    @Input() lazy: boolean = true;

    constructor(public el: ElementRef, public domHandler: DomHandler, differs: IterableDiffers, 
            public renderer: Renderer, public changeDetector: ChangeDetectorRef, public objectUtils: ObjectUtils) {
        super(el, domHandler, differs, renderer, changeDetector, objectUtils);
    }
}

export {
    DTRadioButton,
    DTCheckbox,
    RowExpansionLoader
    // ColumnHeaders,
    // ColumnFooters,
    // TableBody
} from 'primeng/components/datatable/datatable';
