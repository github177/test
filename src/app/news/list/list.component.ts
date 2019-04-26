import { Component, OnInit } from '@angular/core';
import { GatewayService } from 'src/app/shared/gateway.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    public tableDataMore: {
        name: string;
        port: number;
        version: string;
    }[] = [];
    constructor(private gatewayService: GatewayService) {}

    ngOnInit() {
        this.gatewayService.getTestData().subscribe(x => {
            console.log(x);
            if (x.RetCode && x.RetCode === 'Error') {
                alert(x.RetMessage);
            } else {
                this.tableDataMore = x;
            }
        });
    }

    public handle(ref: any): void {
        // console.log(ref.index)
        console.log(ref.rowData);
        // console.log(ref.innerHTML)
        // ref.destroy();
    }
}
