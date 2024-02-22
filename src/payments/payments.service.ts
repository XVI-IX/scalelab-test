import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import config from './config';
import axios from 'axios';
import { TransferRecipient } from './recipient.entity';
import { uuid } from 'uuidv4';

@Injectable()
export class PaymentsService {
  constructor() {}

  async intializePayment(amount: number, email: string) {
    const payload: any = {
      amount: (amount + config.TRANSACTION_FEE) * 100,
      email: email,
    };

    const headers = {
      Authorization: `Bearer ${config.PAYSTACK_KEY}`,
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    };
    try {
      const response = await axios.post(
        `${config.URL}/transaction/initialize`,
        payload,
        {
          headers,
        },
      );

      if (!response.data && response.status !== 200) {
        throw new BadRequestException(
          'Error occured with third party. Please try again',
        );
      }

      const { authorization_url, reference, access_code } = response.data.data;

      return {
        authorization_url,
        reference,
        access_code,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async verifyPayment(reference: string) {
    const headers = {
      Authorization: `Bearer ${config.PAYSTACK_KEY}`,
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    };
    try {
      const response = await axios.get(
        `${config.URL}/transaction/verify/${reference}`,
        {
          headers,
        },
      );

      if (!response.data && response.status !== 200) {
        throw new BadRequestException(
          'Error occured with third party. Please try again',
        );
      }

      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createTransferRecipient(dto: TransferRecipient) {
    const headers = {
      Authorization: `Bearer ${config.PAYSTACK_KEY}`,
      'content-type': 'application/json',
    };

    const payload = {
      type: 'nuban',
      name: dto.name,
      account_number: dto.account_number,
      bank_code: dto.bank_code,
    };
    try {
      const response = await axios.post(
        `${config.URL}/transferrecipient`,
        payload,
        {
          headers,
        },
      );

      if (!response.status) {
        throw new InternalServerErrorException(
          'Transfer recipient could not be created.',
        );
      }

      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async generateTransferReference(amount: string, recipient_code: string) {
    try {
      const reference = uuid();

      return {
        source: 'balance',
        reason: 'withdrawal',
        amount,
        reference,
        recipient: recipient_code,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async initiateTransfer(transferReference: any) {
    const headers = {
      Authorization: `Bearer ${config.PAYSTACK_KEY}`,
      'content-type': 'application/json',
    };
    try {
      const response = await axios.post(
        `${config.URL}/transfer`,
        transferReference,
        {
          headers,
        },
      );

      if (!response) {
        throw new BadRequestException('Transfer could not be initiated');
      }

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
