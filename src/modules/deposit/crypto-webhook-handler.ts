import { Webhook } from "coinbase-commerce-node";
import type { Request, Response } from "express";


interface IRequest extends Request {
    rawBody: string;
}

export const handleWebhook = (request: IRequest, response: Response) => {
    let event;

    console.log(request.headers);

    try {
        event = Webhook.verifyEventBody(
            request.rawBody,
            // @ts-ignore
            request.headers['x-cc-webhook-signature'],
            process.env.COINBASE_WEBHOOK_SECRET
        );
    } catch (error: any) {
        console.log('Error occured', error.message);

        return response.status(400).send('Webhook Error:' + error.message);
    }

    console.log('Success', event.id);

    response.status(200).send('Signed Webhook Received: ' + event.id);
};
