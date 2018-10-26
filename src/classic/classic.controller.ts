import { Controller, Get, Res, Render, Req, Post, Body } from '@nestjs/common';
import * as PayPal from 'paypal-nvp-api';

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

    @Get('shipping')
    @Render('classic/shipping')
    async shipping(@Req() req) {
        try {
            if (req.query.token) {
                const getec = await this._getExpressCheckout(req.query.token);
                return this._mapData(getec);
            }
            return this._mapData();
        } catch (err) {
            return err;
        }
    }

    @Get('setexpresscheckoutredirect')
    async getredirect(@Res() res) {
        try {
            const result = await this._setExpressCheckout();
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Headers', 'Origin, Content0-Type, Authorization');
            return res.redirect(`https://www.sandbox.paypal.com/checkoutnow?token=${result.TOKEN}`);
        } catch (err) {
            return err;
        }
    }

    @Post('setexpresscheckoutredirect')
    async postredirect(@Res() res, @Body() body) {
        try {
            if (body.paymentMethod && body.paymentMethod !== 'paypal') {
                return res.redirect(`/classic/done`);
            }
            const result = await this._setExpressCheckout();
            res.set('Accept', null);
            
            return res.redirect(302, `https://www.sandbox.paypal.com/checkoutnow?token=${result.TOKEN}`);
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
        if (req.query.paymentMethod && req.query.paymentMethod === 'paypal' && !req.query.token) {
            const result = await this._setExpressCheckout(true);
            return res.redirect(`https://www.sandbox.paypal.com/checkoutnow?token=${result.TOKEN}`);
        }
        else if (req.query.token) {
            const getec = await this._getExpressCheckout(req.query.token);
            return this._mapData(getec);
        }
        return {
            ...this._mapData(),
            address: {
                name: 'David Larusso',
                street: '2211 N. 1st Street',
                city: 'San Jose',
                state: 'CA',
                zip: '95131',
                country: 'US',
            },
        };
    }
    /*
    @Post('confirm')
    @Render('classic/confirm')
    async postconfirm(@Res() res, @Body() body) {
        try {
            if (body.paymentMethod && body.paymentMethod !== 'paypal') {
                return res.redirect(`/classic/done`);
            }
            const result = await this._setExpressCheckout();
            return res.redirect(`https://www.sandbox.paypal.com/checkoutnow?token=${result.TOKEN}`);
        } catch (err) {
            return err;
        }
    }
    */

    @Post('process')
    @Render('pages/done')
    async process(@Body() body) {
        if (body.token === 'CREDIT_CARD') {
            return {
                transaction: {
                    id: 'Credit_Card_Transaction_ID',
                    amount: '10',
                    status: 'approved',
                    timestamp: 'now',
                },
            };
        }
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

    @Get('done')
    @Render('pages/donenothing')
    async done() {}

    @Post('api/setexpresscheckout')
    apisetec() {
        return this._setExpressCheckout();
    }

    private _setExpressCheckout(confirm?) {
        return this._paypal.request('SetExpressCheckout', {
            PAYMENTREQUEST_0_AMT: '50',
            PAYMENTREQUEST_0_CURRENCYCODE: 'USD',
            PAYMENTREQUEST_0_PAYMENTACTION: 'SALE',
            RETURNURL: confirm ? 'http://localhost:3000/classic/confirm' : 'http://localhost:3000/classic/shipping',
            CANCELURL: 'http://localhost:3000/classic/cancel',
          });
    }

    private _getExpressCheckout(token, payerid?) {
        return this._paypal.request('GetExpressCheckoutDetails', {
            TOKEN: token,
            // PAYERID: payerid,
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

    private _mapData(response?) {
        if (response) {
            return {
                order: {
                  amount: response.AMT,
                  currency: response.CURRENCYCODE,
                  token: response.TOKEN,
                  payerid: response.PAYERID,
                  action: 'Sale',
                },
                account: {
                    email: response.EMAIL,
                    phone: response.PHONENUM,
                    status: response.PAYERSTATUS,
                    fname: response.FIRSTNAME,
                    lname: response.LASTNAME,
                },
                address: {
                  name: response.PAYMENTREQUEST_0_SHIPTONAME,
                  street: response.PAYMENTREQUEST_0_SHIPTOSTREET,
                  city: response.PAYMENTREQUEST_0_SHIPTOCITY,
                  state: response.PAYMENTREQUEST_0_SHIPTOSTATE,
                  zip: response.PAYMENTREQUEST_0_SHIPTOZIP,
                  country: response.PAYMENTREQUEST_0_SHIPTOCOUNTRYCODE,
                },
              };
        }
        return {
            order: {
                amount: '10.00',
                currency: 'USD',
                token: 'CREDIT_CARD',
                payerid: 'CREDIT_CARD',
                action: 'Sale',
            },
        };
    }

}
