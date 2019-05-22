import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GatewayService } from 'src/app/shared/gateway.service';

declare let laydate;
@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, AfterViewInit {
    public tableDataMore: {
        name: string;
        port: number;
        version: string;
    }[] = [];

    public getImgInterval: number;

    constructor(private gatewayService: GatewayService) {}

    ngOnInit() {
        laydate.render({
            elem: '#time',
            lang: 'en',
            type: 'datetime',
            // MMM d, y, h:mm:ss a     dd/MM/yyyy HH:mm
            format: 'dd/MM/yyyy HH:mm'
        });
        this.gatewayService.getTestData().subscribe(testData => {
            if (testData) {
                this.tableDataMore = testData;
            }
        });
    }

    ngAfterViewInit() {}

    public handle(ref: any): void {
        // console.log(ref.index)
        console.log(ref.rowData);
        // console.log(ref.innerHTML)
        // ref.destroy();
    }

    public startGetImg() {
        this.getImgInterval = window.setInterval(() => {
            const div = document.createElement('div') as HTMLDivElement;
            div.className = 'item';
            div.innerHTML =
                '<img src="' +
                'https://uploadbeta.com/api/pictures/random/?key=%E6%8E%A8%E5%A5%B3%E9%83%8E' +
                '" alt="">';
            document.getElementById('box').appendChild(div);
        }, 1000);
    }

    public stopGetImg() {
        window.clearInterval(this.getImgInterval);
    }
}
