import { Controller, Get, Render, Req } from '@nestjs/common';

@Controller('upgrade')
export class UpgradeController {

    @Get('cart')
    @Render('upgrade/cart')
    cart(@Req() req) {
        return {
            complete: req.query.complete === 'true' ? true : false,
        };
    }

    @Get('payment')
    @Render('upgrade/payment')
    payment(@Req() req) {
        return {
            complete: req.query.complete === 'true' ? true : false,
        };
    }
    /*
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
    */

}
