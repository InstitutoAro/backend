import { Address } from '@app/entities/transaction/address';
import { Customer } from '@app/entities/transaction/customer';
import { Product } from '@app/entities/transaction/product';
import { Injectable } from '@nestjs/common';
import { Transaction } from '../../entities/transaction/transaction';
import { TransactionRepository } from '../../repositories/transaction-repository';

interface CreateTransactionRequest {
  addressCity: string;
  addressComplement: string;
  addressDistrict: string;
  addressNumber: string;
  addressStateInitials: string;
  addressStreet: string;
  addressZipCode: string;
  customerEmail: string;
  customerIdentity: string;
  customerName: string;
  customerPhone: string;
  productCode: string;
  productDescription: string | undefined;
  productPrice: number;
  paymentMethod: string;
  installments: number;
  message: string | undefined;
  status: number | undefined;
  discount?: number;
  cardToken?: string;
  hasError: boolean;
  errorCode: string;
  errorMessage: string;
}
interface CreateTransactionResponse {
  transaction: Transaction;
}

@Injectable()
export class CreateUnsuccessfullyTransaction {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(
    request: CreateTransactionRequest,
  ): Promise<CreateTransactionResponse> {
    const {
      addressCity,
      addressComplement,
      addressDistrict,
      addressNumber,
      addressStateInitials,
      addressStreet,
      addressZipCode,
      customerEmail,
      customerIdentity,
      customerName,
      customerPhone,
      productCode,
      productDescription,
      productPrice,
      paymentMethod,
      installments,
      message,
      status,
      discount,
      cardToken,
      hasError,
      errorCode,
      errorMessage,
    } = request;

    const identity = customerIdentity;

    const transaction = new Transaction({
      customer: new Customer(
        {
          address: new Address({
            city: addressCity,
            complement: addressComplement,
            district: addressDistrict,
            number: addressNumber,
            stateInitials: addressStateInitials,
            street: addressStreet,
            zipCode: addressZipCode,
          }),
          email: customerEmail,
          name: customerName,
          phone: customerPhone,
        },
        identity,
      ),
      product: new Product(
        {
          description: productDescription,
          price: productPrice,
        },
        productCode,
      ),
      discount,
      cardToken,
      installments,
      message,
      paymentMethod,
      status,
      hasError,
      errorCode,
      errorMessage,
    });

    const transactionPrisma =
      await this.transactionRepository.createUnsuccessfullyTransaction(
        transaction,
      );

    console.log('transactionPrisma');
    console.log(transaction);

    return {
      transaction,
    };
  }
}
