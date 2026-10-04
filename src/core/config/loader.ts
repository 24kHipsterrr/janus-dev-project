// © Janus — yashxsanjay
import featuresConfig from '@config/features.json'
import themeConfig from '@config/theme.json'
import brandConfig from '@config/brand.json'
import categoriesConfig from '@config/categories.json'
import plansConfig from '@config/plans.json'

export const features = featuresConfig as Record<string, boolean>
export const theme = themeConfig
export const brand = brandConfig
export const categories = categoriesConfig.categories
export const plans = plansConfig.plans
