import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import { brokerUrl, topic } from './topics';
import { useLightStore } from '../store/lightStored';

let client: MqttClient | null = null;

export function getClient() {
  if (client) return client;
  const options: IClientOptions = {
    clientId: 'rn-' + Math.random().toString(16).slice(2),
    keepalive: 60,
    reconnectPeriod: 1500,
    clean: true,
    // will: { topic: topic.state, payload: JSON.stringify({ online:false }), retain: true }
  };

  client = mqtt.connect(brokerUrl, options);

  client.on('connect', () => {
    console.log('✅ MQTT connected');
    client!.subscribe(topic.state, (err) => {
      if (!err) console.log('Subscribed:', topic.state);
    });
    // Xin trạng thái mới nhất (nếu device có hỗ trợ)
    // client!.publish(topic.set, JSON.stringify({ query: 'state' }));
  });

  client.on('message', (t, msg) => {
    if (t === topic.state) {
      try {
        const state = JSON.parse(msg.toString());
        useLightStore.getState().hydrateFromDevice(state);
      } catch (e) {
        console.warn('Bad state payload', e);
      }
    }
  });

  client.on('error', (e) => console.log('❌ MQTT error', e));
  client.on('close', () => console.log('🔌 MQTT closed'));
  client.on('reconnect', () => console.log('♻ reconnecting...'));
  return client!;
}

export function publishSet(payload: any) {
  const c = getClient();
  c.publish(topic.set, JSON.stringify(payload));
}

export function endClient() {
  if (client) {
    client.end();
    client = null;
  }
}
