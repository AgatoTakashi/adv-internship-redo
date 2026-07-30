export default function Statistics() {
  return (
    <section className="py-20">
      <div className="max-w-[1070px] mx-auto px-6 flex flex-col md:flex-row gap-20">

        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="statistics__heading">Read more</h3>
          <h3 className="statistics__heading statistics__heading--active">
            Learn more
          </h3>
          <h3 className="statistics__heading">Grow more</h3>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 flex flex-col gap-6 bg-[#f1f6f4] p-10 rounded-md">
          
          {/* Stat 1 */}
          <div className="statistics__data">
            <span className="statistics__data--number">89%</span>
            <span className="statistics__data--title">
              of users say Summarist helps them read more books
            </span>
          </div>

          {/* Stat 2 */}
          <div className="statistics__data">
            <span className="statistics__data--number">94%</span>
            <span className="statistics__data--title">
              of users report better retention of key ideas
            </span>
          </div>

          {/* Stat 3 */}
          <div className="statistics__data">
            <span className="statistics__data--number">91%</span>
            <span className="statistics__data--title">
              of users say they save hours every week
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
