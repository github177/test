import { Component, OnInit } from "@angular/core";
import { GatewayService } from "src/app/shared/gateway.service";

@Component({
    selector: "app-list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
    public tableDataMore = [
        { name: "1", date: "1", address: "1" },
        { name: "1", date: "1", address: "1" },
        { name: "2", date: "2", address: "2" },
        { name: "1", date: "1", address: "1" },
        { name: "2", date: "2", address: "2" },
        { name: "1", date: "1", address: "1" },
        { name: "2", date: "2", address: "2" }
    ];
    constructor(private gatewayService: GatewayService) {}

    ngOnInit() {
        this.gatewayService.getTestData().subscribe(x => console.log(x));
    }

    public handle(ref: any): void {
        // console.log(ref.index)
        console.log(ref.rowData);
        // console.log(ref.innerHTML)
        // ref.destroy();
    }
}
