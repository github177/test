import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
    public currentLink = "home";

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.router.events.subscribe((event: NavigationEnd) => {
            if (event instanceof NavigationEnd) {
                console.log(this.activatedRoute.children[0].routeConfig.path);

                this.currentLink = this.activatedRoute.children[0].routeConfig.path;

                // Get Current Path:  company  同理
                // this.activatedRoute.url.subscribe(url => console.log(url[0].path));

                // Route Data:  { title: 'Company' }
                // this.activatedRoute.data.subscribe(data => console.log(data));
            }
        });
    }

    ngOnInit() {
        // console.log(this.activatedRoute);
    }

    public submit() {
        alert("Submit!");
    }
}
