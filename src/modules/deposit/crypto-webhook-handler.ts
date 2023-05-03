import { Webhook } from "coinbase-commerce-node";
import type { Request, Response } from "express";


interface IReq extends Request {
    rawBody: string;
}

export const handleWebhook = async (req: IReq, res: Response) => {
    let event;

    console.log(req.headers);

    try {
        event = Webhook.verifyEventBody(
            req.rawBody,
            // @ts-ignore
            req.headers['x-cc-webhook-signature'],
            process.env.COINBASE_WEBHOOK_SECRET!
        );

        console.log(event);

    } catch (error: any) {
        console.log('Error occured', error.message);

        return res.status(400).send('Webhook Error:' + error.message);
    }

    console.log('Success', event.id);


    res.status(200).send('Signed Webhook Received: ' + event.id);
};
