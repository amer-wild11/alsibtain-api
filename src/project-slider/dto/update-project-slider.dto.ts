import { PartialType } from "@nestjs/mapped-types";
import { CreateProjectSliderDto } from "./create-project-slider.dto";

export class UpdateProjectSliderDto extends PartialType(CreateProjectSliderDto) {}