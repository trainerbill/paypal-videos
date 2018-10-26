import { Controller, Get, Render, Req } from '@nestjs/common';

@Controller('integrate')
export class IntegrateController {

    @Get('cart')
    @Render('integrate/cart')
    link(@Req() req) {
        return {
            complete: req.query.complete === 'true' ? true : false,
            type: this._setIntegrationType(req),
        };
    }

    @Get('payment')
    @Render('integrate/payment')
    formPayment(@Req() req) {
        return {
            complete: req.query.complete === 'true' ? true : false,
            type: this._setIntegrationType(req),
        };
    }

    @Get('product')
    @Render('integrate/product')
    product(@Req() req) {
        return {
            complete: req.query.complete === 'true' ? true : false,
            type: this._setIntegrationType(req),
        };
    }

    private _setIntegrationType(req) {
        return {
            client: req.query.integrationType === 'integrationTypeClient' ? true : false,
            jquery: req.query.integrationType === 'integrationTypeJqueryServer' ? true : false,
            paypal: req.query.integrationType === 'integrationTypePayPalServer' ? true : false,
        };
    }
}
