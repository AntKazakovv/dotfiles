export type TExternalServices = keyof typeof externalServices;

export const externalServices = {
    'optimization': {
        config: '$base.optimization.slimImages.use',
        importFn: async () => {
            return await import('wlc-engine/services/optimization/optimization.service');
        },
    },
    'monitoring': {
        config: '$base.monitoring.performanceReport.use',
        importFn: async () => {
            return await import('wlc-engine/services/monitoring/monitoring.service');
        },
    },
};
