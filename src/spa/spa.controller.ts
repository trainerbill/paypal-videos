import { Controller, Get, Render } from '@nestjs/common';

@Controller('spa')
export class SpaController {

    @Get()
    @Render('spa/home')
    home() {
        
    }

}
