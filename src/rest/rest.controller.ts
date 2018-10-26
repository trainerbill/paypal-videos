import { Controller, Post, Res, Body, Get, Req, Render } from '@nestjs/common';
import * as paypal from 'paypal-rest-sdk';

@Controller('rest')
export class RestController {

    private _id: string;
    private _secret: string;
    private _env: any;
    private _client: any;

    constructor() {
        this._id = process.env.PAYPAL_CLIENT_ID;
        this._secret = 'asdf' || process.env.PAYPAL_SECRET;
        this._env = new paypal.core.SandboxEnvironment(this._id, this._secret);
        this._client = new paypal.core.PayPalHttpClient(this._env);
    }

    @Get('shipping')
    @Render('rest/shipping')
    async shipping(@Req() req) {
        try {
            if (req.query.paymentId) {
                const request = new paypal.v1.payments.PaymentGetRequest(req.query.paymentId);
                const response = await this._client.execute(request);
                return this._mapData(response);
            }
            return this._mapData();
        } catch (err) {
            return err;
        }
    }

    @Render('pages/done')
    @Post('process')
    async process(@Res() res, @Body() body) {
        try {
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
            const request = new paypal.v1.payments.PaymentExecuteRequest(body.token);
            request.requestBody({
                payer_id: body.payer_id,
            });
            const response = await this._client.execute(request);
            return {
                transaction: {
                    id: response.result.transactions[0].related_resources[0].sale.id,
                    amount: response.result.transactions[0].amount.total,
                    status: response.result.state,
                    timestamp: response.result.create_time,
                },
            };
        } catch (err) {
            return res.status(400).json(err);
        }
    }

    @Post('api/create')
    async create(@Req() req, @Body() body) {
        try {

            const payment = {
                intent: 'sale',
                transactions: [{
                    amount: {
                        currency: 'USD',
                        total: '10.00',
                    },
                }],
                redirect_urls: {
                  cancel_url: 'http://localhost:3000/classic/cancel',
                  return_url: body.city ? 'http://localhost:3000/rest/confirm' : 'http://localhost:3000/rest/shipping',
                },
                payer: {
                  payment_method: 'paypal',
                },
            };
            const request = new paypal.v1.payments.PaymentCreateRequest();
            request.requestBody(payment);
            const response = await this._client.execute(request);
            return response.result;
        } catch (err) {
            return err;
        }
    }

    @Get('confirm')
    @Render('rest/confirm')
    async confirm(@Res() res, @Req() req) {
        try {
            if (req.query.paymentId) {
                const request = new paypal.v1.payments.PaymentGetRequest(req.query.paymentId);
                const response = await this._client.execute(request);
                return this._mapData(response);
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
        } catch (err) {
            return err;
        }
    }

    private _mapData(response?) {
        if (response) {
            return {
                order: {
                    amount: response.result.transactions[0].amount.total,
                    currency: response.result.transactions[0].amount.currency,
                    token: response.result.id,
                    payerid: response.result.payer.payer_info.payer_id,
                    action: response.result.intent,
                },
                account: {
                    email: response.result.payer.payer_info.email,
                    phone: response.result.payer.payer_info.phone,
                    status: response.result.payer.status,
                    fname: response.result.payer.payer_info.first_name,
                    lname: response.result.payer.payer_info.last_name,
                    payer_id: response.result.payer.payer_info.payer_id,
                },
                address: {
                    name: response.result.payer.payer_info.shipping_address.recipient_name,
                    street: response.result.payer.payer_info.shipping_address.line1,
                    city: response.result.payer.payer_info.shipping_address.city,
                    state: response.result.payer.payer_info.shipping_address.state,
                    zip: response.result.payer.payer_info.shipping_address.postal_code,
                    country: response.result.payer.payer_info.shipping_address.country_code,
                },
            };
        } else {
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

}
