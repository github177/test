import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ElModule } from "element-angular";
import { NewsRoutingModule } from "./news-routing.module";

import { ListComponent } from "./list/list.component";
import { HomeComponent } from "./home/home.component";
import { NewsComponent } from "./news.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [ListComponent, HomeComponent, NewsComponent],
    imports: [CommonModule, NewsRoutingModule, SharedModule, ElModule.forRoot()]
})
export class NewsModule {}
