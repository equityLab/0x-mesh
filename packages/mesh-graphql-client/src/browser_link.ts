import { MeshWrapper } from '@0x/mesh-browser-lite/lib/types';
import { Observable } from '@apollo/client';
import { ApolloLink, FetchResult, Operation } from '@apollo/client/link/core';

export class BrowserLink extends ApolloLink {
    constructor(private readonly _meshWrapper: MeshWrapper) {
        super();
    }

    public request(operation: Operation): Observable<FetchResult> | null {
        // FIXME - Don't use the `any` type and possibly do more input sanitation
        switch (operation.operationName) {
            case 'AddOrders':
                return new Observable((observer: any) => {
                    this._meshWrapper
                        .gqlAddOrdersAsync(operation.variables.orders, operation.variables.pinned)
                        .then(addOrders => {
                            observer.next({ data: { addOrders } });
                            observer.complete();
                            return { data: { addOrders } };
                        })
                        .catch(err => {
                            throw err;
                        });
                });
            case 'Order':
                return new Observable((observer: any) => {
                    this._meshWrapper
                        .gqlGetOrderAsync(operation.variables.hash)
                        .then(order => {
                            observer.next({ data: { order } });
                            observer.complete();
                            return { data: { order } };
                        })
                        .catch(err => {
                            throw err;
                        });
                });
            case 'Orders':
                return new Observable((observer: any) => {
                    this._meshWrapper
                        .gqlFindOrdersAsync(
                            operation.variables.sort,
                            operation.variables.filters,
                            operation.variables.limit,
                        )
                        .then(orders => {
                            observer.next({
                                data: {
                                    orders,
                                },
                            });
                            observer.complete();
                            return {
                                data: {
                                    orders,
                                },
                            };
                        })
                        .catch(err => {
                            throw err;
                        });
                });
            case 'Stats':
                return new Observable((observer: any) => {
                    this._meshWrapper
                        .gqlGetStatsAsync()
                        .then(stats => {
                            observer.next({
                                data: {
                                    stats,
                                },
                            });
                            observer.complete();
                            return {
                                data: {
                                    stats,
                                },
                            };
                        })
                        .catch(err => {
                            throw err;
                        });
                });
            default:
                throw new Error('browser link: unrecognized operation name');
        }
        return null;
    }
}