import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';
// const FormData = require('form-data');
import fs from 'fs';

dotenv.config()

const sendTemplateMessage = async () => {
  const response = await axios({
    url: 'https://graph.facebook.com/v25.0/1054627024408940/messages',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      messaging_product: 'whatsapp',
      to: '917030577234',
      type: 'template',
      template: {
        name: 'hello_world',
        language: {
          code: 'en_US'
        }
      }
    })
  })

  console.log(response.data);
}

const sendTextMessage = async (to, message) => {
  const response = await axios({
    url: 'https://graph.facebook.com/v25.0/1054627024408940/messages',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: {
        body: message
      }
    })
  })

  console.log(response.data);
}

const sendMediaMessage = async () => {
  const response = await axios({
    url: 'https://graph.facebook.com/v25.0/1054627024408940/messages',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      messaging_product: 'whatsapp',
      to: '917030577234',
      type: 'image',
      image: {
        id: '972018972104768',
        caption: 'caption'
      }
    })
  })

  console.log(response.data);
}

const uploadImage = async () => {
  const data = new FormData();
  data.append('messaging_product', 'whatsapp');
  data.append('file', fs.createReadStream(process.cwd() + '/logo.png', { contentType: 'image/png' }));
  data.append('type', 'image/png');
  
  const response = await axios({
    url: 'https://graph.facebook.com/v25.0/1054627024408940/media',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`
    },
    data: data
  })

  console.log(response.data);
}

export {
  sendTemplateMessage,
  sendTextMessage,
  sendMediaMessage,
  uploadImage
}
