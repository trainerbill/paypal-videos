import { Controller, Get, Render, Req } from '@nestjs/common';

@Controller('upgrade')
export class UpgradeController {

    @Get('link')
    @Render('upgrade-link-cart')
    link(@Req() req) {
        return {
            complete: req.query.complete === 'true' ? true : false,
        };
    }

    @Get('form')
    @Render('upgrade-form-cart')
    form(@Req() req) {
        return {
            complete: req.query.complete === 'true' ? true : false,
        };
    }

    @Get('ajax')
    @Render('upgrade-ajax-cart')
    ajax(@Req() req) {
        return {
            complete: req.query.complete === 'true' ? true : false,
        };
    }

    @Get('form/payment')
    @Render('upgrade-form-payment')
    formPayment(@Req() req) {
        return {
            complete: req.query.complete === 'true' ? true : false,
        };
    }

    @Get('ajax/payment')
    @Render('upgrade-ajax-payment')
    ajaxPayment(@Req() req) {
        return {
            complete: req.query.complete === 'true' ? true : false,
        };
    }

}
