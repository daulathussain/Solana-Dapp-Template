use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("BZux6McmrjjyDHkYMtnoivgbsoKMRwRSficXMxcCVwR2");

#[program]
pub mod real_estate_dapp {
    use super::*;

    pub fn list_property(
        ctx: Context<ListProperty>,
        property_id: String,
        price: u64,
        description: String,
    ) -> Result<()> {
        let property = &mut ctx.accounts.property;
        property.owner = ctx.accounts.user.key();
        property.property_id = property_id;
        property.price = price;
        property.description = description;
        property.is_available = true;
        Ok(())
    }

    pub fn buy_property(ctx: Context<BuyProperty>, property_id: String) -> Result<()> {
        let property = &mut ctx.accounts.property;
        // Ensure the property ID matches the one in the account
        require!(
            property.property_id == property_id,
            CustomError::PropertyIdMismatch
        );
        require!(property.is_available, CustomError::PropertyNotAvailable);
        require!(
            property.owner != ctx.accounts.buyer.key(),
            CustomError::CannotBuyOwnProperty
        );

        let amount = property.price;

        **ctx
            .accounts
            .buyer
            .to_account_info()
            .try_borrow_mut_lamports()? -= amount;
        **ctx
            .accounts
            .property_owner
            .to_account_info()
            .try_borrow_mut_lamports()? += amount;

        property.owner = ctx.accounts.buyer.key();
        property.is_available = false;
        Ok(())
    }

    pub fn sell_property(
        ctx: Context<SellProperty>,
        property_id: String,
        price: u64,
    ) -> Result<()> {
        let property = &mut ctx.accounts.property;
        // Ensure the property ID matches the one in the account
        require!(
            property.property_id == property_id,
            CustomError::PropertyIdMismatch
        );
        require!(
            property.owner == ctx.accounts.seller.key(),
            CustomError::NotPropertyOwner
        );

        property.price = price;
        property.is_available = true;
        Ok(())
    }

    pub fn get_properties_by_user(
        ctx: Context<GetPropertiesByUser>,
        user: Pubkey,
    ) -> Result<Vec<Property>> {
        let properties = &ctx.accounts.properties;
        let user_properties: Vec<Property> = properties
            .properties
            .iter()
            .filter(|p| p.owner == user)
            .cloned()
            .collect();
        Ok(user_properties)
    }

    pub fn get_property_details(
        ctx: Context<GetPropertyDetails>,
        property_id: String,
    ) -> Result<Property> {
        let property = &ctx.accounts.property;
        require!(
            property.property_id == property_id,
            CustomError::PropertyIdMismatch
        );
        Ok(Property {
            owner: property.owner,
            property_id: property.property_id.clone(),
            price: property.price,
            description: property.description.clone(),
            is_available: property.is_available,
        })
    }
}

#[derive(Accounts)]
pub struct ListProperty<'info> {
    #[account(init, payer = user, space = 8 + 128)]
    pub property: Account<'info, Property>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyProperty<'info> {
    #[account(mut)]
    pub property: Account<'info, Property>,
    #[account(mut)]
    pub property_owner: AccountInfo<'info>,
    #[account(mut)]
    pub buyer: Signer<'info>,
}

#[derive(Accounts)]
pub struct SellProperty<'info> {
    #[account(mut)]
    pub property: Account<'info, Property>,
    #[account(mut)]
    pub seller: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetPropertiesByUser<'info> {
    #[account(seeds = [b"properties"], bump)]
    pub properties: Account<'info, PropertyList>,
}

#[derive(Accounts)]
pub struct GetPropertyDetails<'info> {
    #[account(mut)]
    pub property: Account<'info, Property>,
}

#[account]
pub struct Property {
    pub owner: Pubkey,
    pub property_id: String,
    pub price: u64,
    pub description: String,
    pub is_available: bool,
}

#[account]
pub struct PropertyList {
    pub properties: Vec<Property>,
}

#[error_code]
pub enum CustomError {
    #[msg("Property is not available for purchase.")]
    PropertyNotAvailable,
    #[msg("You cannot buy your own property.")]
    CannotBuyOwnProperty,
    #[msg("You are not the owner of this property.")]
    NotPropertyOwner,
    #[msg("Property ID does not match the account.")]
    PropertyIdMismatch,
}
