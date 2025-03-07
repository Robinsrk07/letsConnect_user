const amqp = require('amqplib');

class GenericConsumer {
    constructor(exchange, queue, useCase) {
        this.connection = null;
        this.channel = null;
        this.queue = queue;
        this.useCase = useCase;
        this.exchange = exchange;

    }

    async connect() {
        this.connection = await amqp.connect('amqp://localhost');

    //  this.connection = await amqp.connect('amqp://admin:password@rabbitmq')
        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange(this.exchange, 'fanout', { durable: true });
  
        await this.channel.assertQueue(this.queue, { durable: true });

        await this.channel.bindQueue(this.queue, this.exchange, '');


    }

    async listen() {
        await this.channel.consume(this.queue, async (message) => {
          // if(this.queue=="user_updated")return
            if (message !== null) {
                console.log("user service rabit mq listen")
                try {
                    const content = JSON.parse(message.content.toString());
                    console.log("content from userClean why ",content)
                    
                    await this.useCase.execute(content);
                    this.channel.ack(message);
                } catch (err) {
                    console.error("Error processing message:", err);
                    this.channel.nack(message, false, false);
                }
            }
        });
    }
}

module.exports = GenericConsumer;