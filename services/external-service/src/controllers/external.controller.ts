// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';


import {get} from '@loopback/rest';
import axios from 'axios';  // Install axios: npm i axios

export class ExternalController {
  @get('/external-data', {
    responses: {
      '200': {
        description: 'External API Data',
        content: {'application/json': {}},
      },
    },
  })
  async getExternalData(): Promise<any> {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch data from external API');
    }
  }
}
