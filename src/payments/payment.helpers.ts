// export interface IAccountNameEnqury {
//   bankCode: string;
//   accountNumber: string;
// }

// export interface IPaystackResolveAccount {
//   account_name: string;
// }

// export interface IPaymentInitializeRequest {
//   amountMajor: number;
//   payingUser: IUser;
// }

// export const initializeTransaction = async (
//   requestData: IPaymentInitializeRequest,
// ): Promise<IPaymentInitializeResponse> => {
//   const { payingUser, amountMajor } = requestData;
//   const base_url = process.env.PAYSTACK_BASE_URL + `/transaction/initialize`;
//   const headers = {
//     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//     'content-type': 'application/json',
//     'cache-control': 'no-cache',
//   };
//   const amountMinor = (amountMajor || 0) * 100;
//   try {
//     const transactionFeeMajor =
//       Util.getPaystackTransactionFeeMajor(amountMajor);
//     const payload: any = {
//       amount: (amountMajor || 0) * 100 + transactionFeeMajor * 100,
//       email: payingUser.email,
//       metadata: {
//         full_name: `${payingUser.firstName} ${payingUser.lastName}`,
//       },
//     };

//     const response: AxiosResponse<any> = await axios.post(base_url, payload, {
//       headers,
//     });

//     if (!response.data && response.status !== 200) {
//       throw new Error(
//         'An error occurred with our third party. Please try again at a later time.',
//       );
//     }
//     const { authorization_url, reference, access_code } = response.data.data;
//     return {
//       paymentProviderRedirectUrl: authorization_url,
//       paymentReference: reference,
//       accessCode: access_code,
//     };
//   } catch (e) {
//     console.log(`e message`, e.message);
//     console.log(e.stack);
//     throw new Error(
//       'An error occurred with our payment provider. Please try again at a later time.',
//     );
//   }
// };
