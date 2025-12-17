using Bearfolio.Api.Data;

namespace Bearfolio.Api.GraphQL;

public class Subscription
{
    [Subscribe]
    [Topic("profileUpdated")]
    public Profile OnProfileUpdated([EventMessage] Profile profile) => profile;

    [Subscribe]
    [Topic("portfolioItemPublished")]
    public PortfolioItem OnPortfolioItemPublished([EventMessage] PortfolioItem item) => item;

    [Subscribe]
    [Topic("opportunityCreated")]
    public Opportunity OnOpportunityCreated([EventMessage] Opportunity opp) => opp;
}
