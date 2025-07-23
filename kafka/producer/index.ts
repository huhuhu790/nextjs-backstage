import { LocalMessage } from '@/types/api';
import { KafkaJS } from '@confluentinc/kafka-javascript';
import { env } from 'process';
const { Kafka } = KafkaJS;
const producer = new Kafka().producer({
    'bootstrap.servers': env.KAFKA_SERVER!
});
export async function sendingMessagesEvent({ message, operatorId }: { message: Partial<LocalMessage>, operatorId: string }) {
    await producer.connect();
    await producer.send({
        topic: 'sendingMessages',
        messages: [
            { value: JSON.stringify(message), key: operatorId },
        ]
    });
    await producer.disconnect();
}