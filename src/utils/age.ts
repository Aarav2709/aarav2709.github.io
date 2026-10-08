const BIRTHDAY = { year: 2010, month: 9, day: 27 };

export function getAge(now: Date = new Date()): number {
  const age = now.getFullYear() - BIRTHDAY.year;
  const hadBirthday =
    now.getMonth() + 1 > BIRTHDAY.month ||
    (now.getMonth() + 1 === BIRTHDAY.month && now.getDate() >= BIRTHDAY.day);

  return hadBirthday ? age : age - 1;
}
