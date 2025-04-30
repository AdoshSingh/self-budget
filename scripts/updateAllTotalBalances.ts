import prisma from "@/db/prismaClient";

async function updateAllTotalBalances () {
  const accounts = await prisma.account.findMany({
    include: {Fund: true},
  });

  for (const account of accounts) {
    const totalFundBalance = account.Fund.reduce((sum, fund) => sum + fund.balance, 0);
    const totalBalance = account.primary_balance + account.secondary_balance + totalFundBalance;

    await prisma.account.update({
      where: { id: account.id },
      data: { total_balance: totalBalance },
    });
  }  
  console.log('✅ Total balances updated for all accounts');
}

updateAllTotalBalances()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });