import { Controller, Get, Res, Render, Req, Post, Body } from '@nestjs/common';
import * as PayPal from 'paypal-nvp-api';
import * as querystring from 'querystring';

@Controller('classic')
export class ClassicController {

    private _paypal: any;

    constructor() {
        const config = {
            mode: process.env.PAYPAL_ENVIRONMENT ? process.env.PAYPAL_ENVIRONMENT : 'sandbox',
            username: process.env.PAYPAL_CLASSIC_USER,
            password: process.env.PAYPAL_CLASSIC_PASSWORD,
            signature: process.env.PAYPAL_CLASSIC_SIGNATURE,
        };

        this._paypal = PayPal(config);
    }

    @Get('setexpresscheckoutredirect')
    async getredirect(@Res() res) {
        try {
            const result = await this._setExpressCheckout();
            return res.redirect(`https://www.sandbox.paypal.com/checkoutnow?token=${result.TOKEN}`);
        } catch (err) {
            return err;
        }
    }

    @Post('setexpresscheckoutredirect')
    async postredirect(@Res() res) {
        try {
            const result = await this._setExpressCheckout();
            return res.redirect(`https://www.sandbox.paypal.com/checkoutnow?token=${result.TOKEN}`);
        } catch (err) {
            return err;
        }
    }

    @Get('cancel')
    @Render('pages/cancel')
    cancel() {}

    @Get('confirm')
    @Render('classic/confirm')
    async confirm(@Req() req, @Res() res) {
        const getec = await this._getExpressCheckout(req.query.token, req.query.payerid);
        return {
            order: {
              amount: getec.AMT,
              currency: getec.CURRENCYCODE,
              token: getec.TOKEN,
              payerid: getec.PAYERID,
              action: 'Sale',
            },
            account: {
                email: getec.EMAIL,
                phone: getec.PHONENUM,
                status: getec.PAYERSTATUS,
                fname: getec.FIRSTNAME,
                lname: getec.LASTNAME,
            },
            address: {
              name: getec.PAYMENTREQUEST_0_SHIPTONAME,
              street: getec.PAYMENTREQUEST_0_SHIPTOSTREET,
              city: getec.PAYMENTREQUEST_0_SHIPTOCITY,
              state: getec.PAYMENTREQUEST_0_SHIPTOSTATE,
              zip: getec.PAYMENTREQUEST_0_SHIPTOZIP,
              country: getec.PAYMENTREQUEST_0_SHIPTOCOUNTRYCODE,
            },
          };
    }

    @Post('process')
    @Render('pages/done')
    async process(@Body() body) {
        const result = await this._doExpressCheckout('50', body.token, body.payerid);
        return {
            transaction: {
                id: result.TRANSACTIONID,
                amount: result.AMT,
                status: result.PAYMENTINFO_0_PAYMENTSTATUS,
                timestamp: result.ORDERTIME,
            },
        };
    }

    @Post('api/setexpresscheckout')
    apisetec() {
        return this._setExpressCheckout();
    }

    private _setExpressCheckout() {
        return this._paypal.request('SetExpressCheckout', {
            PAYMENTREQUEST_0_AMT: '50',
            PAYMENTREQUEST_0_CURRENCYCODE: 'USD',
            PAYMENTREQUEST_0_PAYMENTACTION: 'SALE',
            RETURNURL: 'http://localhost:3000/classic/confirm',
            CANCELURL: 'http://localhost:3000/classic/cancel',
          });
    }

    private _getExpressCheckout(token, payerid) {
        return this._paypal.request('GetExpressCheckoutDetails', {
            TOKEN: token,
            PAYERID: payerid,
          });
    }

    private _doExpressCheckout(AMT, TOKEN, PAYERID, PAYMENTACTION = 'Sale') {
        return this._paypal.request('DoExpressCheckoutPayment', {
          AMT,
          TOKEN,
          PAYERID,
          PAYMENTACTION,
        });
      }

}
